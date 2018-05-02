package com.salo.model;

import java.util.Date;

public class UserRate extends UserRateKey {
    private Integer rate;

    private Date ratetime;

    public Integer getRate() {
        return rate;
    }

    public void setRate(Integer rate) {
        this.rate = rate;
    }

    public Date getRatetime() {
        return ratetime;
    }

    public void setRatetime(Date ratetime) {
        this.ratetime = ratetime;
    }
}