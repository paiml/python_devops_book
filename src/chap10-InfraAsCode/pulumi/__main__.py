import json
import mimetypes
import os

from pulumi import export, FileAsset
from pulumi_aws import s3, route53, acm, cloudfront

import pulumi

config = pulumi.Config('proj1')  # proj1 is project name defined in Pulumi.yaml

content_dir = config.require('local_webdir') # www-staging or www-prod
domain_name = config.require('domain_name') # staging.devops4all.dev or www.devops4all.dev
dns_zone_id = config.require('dns_zone_id') 

web_bucket = s3.Bucket('s3-website-bucket', website={
    "index_document": "index.html"
})

for file in os.listdir(content_dir):
    filepath = os.path.join(content_dir, file)
    mime_type, _ = mimetypes.guess_type(filepath)
    obj = s3.BucketObject(file,
        bucket=web_bucket.id,
        source=FileAsset(filepath),
        content_type=mime_type)

def public_read_policy_for_bucket(bucket_name):
    return json.dumps({
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                f"arn:aws:s3:::{bucket_name}/*",
            ]
        }]
    })

web_bucket_id = web_bucket.id
web_bucket_policy = s3.BucketPolicy("bucket-policy",
    bucket=web_bucket_id,
    policy=web_bucket_id.apply(public_read_policy_for_bucket))


# Split a domain name into its subdomain and parent domain names.
# e.g. "www.example.com" => "www", "example.com".
def get_domain_and_subdomain(domain):
	names = domain.split(".")
	if len(names) < 3:
		return('', domain)
	subdomain = names[0]
	parent_domain = ".".join(names[1:])
	return (subdomain, parent_domain)

(subdomain, parent_domain) = get_domain_and_subdomain(domain_name)
# zone = route53.Zone("route53_zone", name=parent_domain)

# create ACM certificate
cert = acm.Certificate('certificate', domain_name=domain_name, validation_method='DNS')
domain_validation_options = cert.domain_validation_options[0]

# Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
cert_validation_dns_record = route53.Record(
	'cert-validation-record', 
	name=domain_validation_options['resourceRecordName'],
	zone_id=dns_zone_id,
	type=domain_validation_options['resourceRecordType'],
	records=[domain_validation_options['resourceRecordValue']],
	ttl=600)

# This is a _special_ resource that waits for ACM to complete validation via the DNS record
# checking for a status of "ISSUED" on the certificate itself. No actual resources are
# created (or updated or deleted).
cert_validation_completion = acm.CertificateValidation('cert-validation-completion',
	certificate_arn=cert.arn,
	validation_record_fqdns=[cert_validation_dns_record.fqdn])

cert_arn = cert_validation_completion.certificate_arn

# Create S3 bucket that will contain the CDN's request logs.
log_bucket = s3.Bucket('cdn-log-bucket', acl='private')

# Create CloudFront distribution pointing to web S3 bucket
cloudfront_distro = cloudfront.Distribution ( 'cloudfront-distro',
    enabled=True,
    aliases=[ domain_name ],
    origins=[
        {
            'originId': web_bucket.arn,
            'domainName': web_bucket.website_endpoint,
            'customOriginConfig': {
                'originProtocolPolicy': "http-only",
                'httpPort': 80,
                'httpsPort': 443,
                'originSslProtocols': ["TLSv1.2"],
            },
        },
    ],
    default_root_object="index.html",
    default_cache_behavior={
        'targetOriginId': web_bucket.arn,
        'viewerProtocolPolicy': "redirect-to-https",
        'allowedMethods': ["GET", "HEAD", "OPTIONS"],
        'cachedMethods': ["GET", "HEAD", "OPTIONS"],
        'forwardedValues': {
            'cookies': { 'forward': "none" },
            'queryString': False,
        },
        'minTtl': 0,
        'defaultTtl': 600,
        'maxTtl': 600,
    },
    price_class="PriceClass_100",
    custom_error_responses=[
        { 'errorCode': 404, 'responseCode': 404, 'responsePagePath': "/404.html" },
    ],
    restrictions={
        'geoRestriction': {
            'restrictionType': "none",
        },
    },
    viewer_certificate={
        'acmCertificateArn': cert_arn,
        'sslSupportMethod': "sni-only",
    },
    logging_config={
        'bucket': log_bucket.bucket_domain_name,
        'includeCookies': False,
        'prefix': domain_name,
    })


# Create DNS record for the deployed site pointing to CloudFront DNS name
site_dns_record = route53.Record(
	'site-dns-record', 
	name=subdomain,
	zone_id=dns_zone_id,
	type="A",
	aliases=[
        {
            'name': cloudfront_distro.domain_name,
            'zoneId': cloudfront_distro.hosted_zone_id,
            'evaluateTargetHealth': True
        }
    ])

#export('domain_validation_options', domain_validation_options)
export('web_bucket_id', web_bucket.id)
export('log_bucket_id', log_bucket.id)
export('website_url', web_bucket.website_endpoint)
export('cloudfront_domain', cloudfront_distro.domain_name)