package com.salo.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseAuth<M extends BaseAuth<M>> extends Model<M> implements IBean {

	public M setAuthId(java.lang.Integer authId) {
		set("authId", authId);
		return (M)this;
	}
	
	public java.lang.Integer getAuthId() {
		return getInt("authId");
	}

	public M setAuthRst(java.lang.String authRst) {
		set("authRst", authRst);
		return (M)this;
	}
	
	public java.lang.String getAuthRst() {
		return getStr("authRst");
	}

}
