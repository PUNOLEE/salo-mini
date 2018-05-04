package com.salo.model;

import java.util.Date;

public class UserInfo {
    private Integer userid;

    private String openid;

    private String username;

    private Integer invitationkeyid;

    private String phonenum;

    private String pwd;

    private String description;

    private String portraiturl;

    private Integer usertype;

    private Integer gender;

    private Integer isauthenticated;

    private Double rate;

    private Date registertime;

    public Integer getUserid() {
        return userid;
    }

    public void setUserid(Integer userid) {
        this.userid = userid;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid == null ? null : openid.trim();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public Integer getInvitationkeyid() {
        return invitationkeyid;
    }

    public void setInvitationkeyid(Integer invitationkeyid) {
        this.invitationkeyid = invitationkeyid;
    }

    public String getPhonenum() {
        return phonenum;
    }

    public void setPhonenum(String phonenum) {
        this.phonenum = phonenum == null ? null : phonenum.trim();
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd == null ? null : pwd.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getPortraiturl() {
        return portraiturl;
    }

    public void setPortraiturl(String portraiturl) {
        this.portraiturl = portraiturl == null ? null : portraiturl.trim();
    }

    public Integer getUsertype() {
        return usertype;
    }

    public void setUsertype(Integer usertype) {
        this.usertype = usertype;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public Integer getIsauthenticated() {
        return isauthenticated;
    }

    public void setIsauthenticated(Integer isauthenticated) {
        this.isauthenticated = isauthenticated;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Date getRegistertime() {
        return registertime;
    }

    public void setRegistertime(Date registertime) {
        this.registertime = registertime;
    }
}