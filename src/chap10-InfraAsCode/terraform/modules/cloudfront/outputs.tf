output "domain_name" {
  value = "${aws_cloudfront_distribution.www_distribution.domain_name}"
}

output "hosted_zone_id" {
  value = "${aws_cloudfront_distribution.www_distribution.hosted_zone_id}"
}
