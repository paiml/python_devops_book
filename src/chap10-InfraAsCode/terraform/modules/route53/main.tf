resource "aws_route53_record" "www" {
  zone_id = "${var.zone_id}"
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = "${var.cloudfront_domain_name}"
    zone_id                = "${var.cloudfront_zone_id}"
    evaluate_target_health = false
  }
}
