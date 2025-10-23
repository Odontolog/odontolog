package br.ufal.ic.odontolog.config;

import lombok.Data;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app.s3")
public class S3Properties {
    private Duration signedUrlTimeout;
    private Buckets buckets;

    @Data
    public static class Buckets {
        private String publicBucket;
        private String privateBucket;
    }
}