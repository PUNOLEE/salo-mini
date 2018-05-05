package com.salo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    private final StringRedisTemplate stringRedisTemplate;

    @Autowired
    public RedisService(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }


    private ValueOperations<String, String> getOperator() {
        return stringRedisTemplate.opsForValue();
    }

//    private ValueOperations<String, Object> getObjectOperator() {
//        return redisTemplate.opsForValue();
//    }

    public void putValidCode(String key, String value) {
        getOperator().set("validCode-" + key, value, 120, TimeUnit.SECONDS);
    }

    public void putSendTime(String key, int value) {
        getOperator().set("sendTime-" + key, String.valueOf(value), 600, TimeUnit.SECONDS);
    }

    public void putSession(String key, String value) {
        getOperator().set("session-" + key, value, 1800, TimeUnit.SECONDS);
    }


    public String getValidCode(String key) {
        return getOperator().get("validCode-" + key);
    }

    public int getSendTime(String key) {
        String value = getOperator().get("sendTime-" + key);
        if (value == null) return 0;
        //getOperator().set("sendTime-" + key, value, 600, TimeUnit.SECONDS);
        return Integer.parseInt(value);
    }

    public String getSession(String key) {
        String value = getOperator().get("session-" + key);
        if (value == null) return null;
        getOperator().set("session-" + key, value, 1800, TimeUnit.SECONDS);
        return value;
    }


}