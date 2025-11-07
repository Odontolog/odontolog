variable "private_bucket_name" {
  description = "Nome do bucket privado (globalmente único)"
  type        = string
}

variable "public_bucket_name" {
  description = "Nome do bucket público (globalmente único)"
  type        = string
}

variable "environment_tag" {
  description = "A etiqueta de ambiente (ex: 'Production', 'Local')"
  type        = string
  default     = "Development"
}

resource "aws_s3_bucket" "private" {
  bucket = var.private_bucket_name

  tags = {
    Name        = "Odontolog - Private Data"
    Environment = var.environment_tag
  }
}

resource "aws_s3_bucket_versioning" "private_versioning" {
  bucket = aws_s3_bucket.private.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "private_encryption" {
  bucket = aws_s3_bucket.private.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "private_access_block" {
    bucket = aws_s3_bucket.private.id
    block_public_acls       = true
    block_public_policy     = true
    ignore_public_acls      = true
    restrict_public_buckets = true 
}

resource "aws_s3_bucket" "public" {
  bucket = var.public_bucket_name

  tags = {
    Name        = "Odontolog - Public Assets"
    Environment = var.environment_tag
  }
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
    bucket = aws_s3_bucket.public.id

    block_public_acls       = false
    block_public_policy     = false
    ignore_public_acls      = false
    restrict_public_buckets = false 
}

resource "aws_s3_bucket_policy" "public_policy" {
  bucket = aws_s3_bucket.public.id
  policy = data.aws_iam_policy_document.public_read_policy.json
}

resource "aws_s3_bucket_cors_configuration" "private_cors" {
  bucket = aws_s3_bucket.private.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

data "aws_iam_policy_document" "public_read_policy" {
  statement {
    sid       = "AllowPublicReadForProfilePhotos"
    effect    = "Allow"
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    actions   = ["s3:GetObject"]
    
    resources = [
      "${aws_s3_bucket.public.arn}/images/user_profile_photos/*"
    ]
  }
}