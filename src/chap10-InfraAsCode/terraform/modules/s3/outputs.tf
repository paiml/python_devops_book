output "s3_www_website_endpoint" {
  value = "${aws_s3_bucket.www.website_endpoint}"
}
