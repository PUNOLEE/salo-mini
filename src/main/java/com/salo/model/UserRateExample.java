package com.salo.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class UserRateExample {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public UserRateExample() {
        oredCriteria = new ArrayList<Criteria>();
    }

    public void setOrderByClause(String orderByClause) {
        this.orderByClause = orderByClause;
    }

    public String getOrderByClause() {
        return orderByClause;
    }

    public void setDistinct(boolean distinct) {
        this.distinct = distinct;
    }

    public boolean isDistinct() {
        return distinct;
    }

    public List<Criteria> getOredCriteria() {
        return oredCriteria;
    }

    public void or(Criteria criteria) {
        oredCriteria.add(criteria);
    }

    public Criteria or() {
        Criteria criteria = createCriteriaInternal();
        oredCriteria.add(criteria);
        return criteria;
    }

    public Criteria createCriteria() {
        Criteria criteria = createCriteriaInternal();
        if (oredCriteria.size() == 0) {
            oredCriteria.add(criteria);
        }
        return criteria;
    }

    protected Criteria createCriteriaInternal() {
        Criteria criteria = new Criteria();
        return criteria;
    }

    public void clear() {
        oredCriteria.clear();
        orderByClause = null;
        distinct = false;
    }

    protected abstract static class GeneratedCriteria {
        protected List<Criterion> criteria;

        protected GeneratedCriteria() {
            super();
            criteria = new ArrayList<Criterion>();
        }

        public boolean isValid() {
            return criteria.size() > 0;
        }

        public List<Criterion> getAllCriteria() {
            return criteria;
        }

        public List<Criterion> getCriteria() {
            return criteria;
        }

        protected void addCriterion(String condition) {
            if (condition == null) {
                throw new RuntimeException("Value for condition cannot be null");
            }
            criteria.add(new Criterion(condition));
        }

        protected void addCriterion(String condition, Object value, String property) {
            if (value == null) {
                throw new RuntimeException("Value for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value));
        }

        protected void addCriterion(String condition, Object value1, Object value2, String property) {
            if (value1 == null || value2 == null) {
                throw new RuntimeException("Between values for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value1, value2));
        }

        public Criteria andUseridIsNull() {
            addCriterion("userId is null");
            return (Criteria) this;
        }

        public Criteria andUseridIsNotNull() {
            addCriterion("userId is not null");
            return (Criteria) this;
        }

        public Criteria andUseridEqualTo(Integer value) {
            addCriterion("userId =", value, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridNotEqualTo(Integer value) {
            addCriterion("userId <>", value, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridGreaterThan(Integer value) {
            addCriterion("userId >", value, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridGreaterThanOrEqualTo(Integer value) {
            addCriterion("userId >=", value, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridLessThan(Integer value) {
            addCriterion("userId <", value, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridLessThanOrEqualTo(Integer value) {
            addCriterion("userId <=", value, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridIn(List<Integer> values) {
            addCriterion("userId in", values, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridNotIn(List<Integer> values) {
            addCriterion("userId not in", values, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridBetween(Integer value1, Integer value2) {
            addCriterion("userId between", value1, value2, "userid");
            return (Criteria) this;
        }

        public Criteria andUseridNotBetween(Integer value1, Integer value2) {
            addCriterion("userId not between", value1, value2, "userid");
            return (Criteria) this;
        }

        public Criteria andRateduseridIsNull() {
            addCriterion("ratedUserId is null");
            return (Criteria) this;
        }

        public Criteria andRateduseridIsNotNull() {
            addCriterion("ratedUserId is not null");
            return (Criteria) this;
        }

        public Criteria andRateduseridEqualTo(Integer value) {
            addCriterion("ratedUserId =", value, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridNotEqualTo(Integer value) {
            addCriterion("ratedUserId <>", value, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridGreaterThan(Integer value) {
            addCriterion("ratedUserId >", value, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridGreaterThanOrEqualTo(Integer value) {
            addCriterion("ratedUserId >=", value, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridLessThan(Integer value) {
            addCriterion("ratedUserId <", value, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridLessThanOrEqualTo(Integer value) {
            addCriterion("ratedUserId <=", value, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridIn(List<Integer> values) {
            addCriterion("ratedUserId in", values, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridNotIn(List<Integer> values) {
            addCriterion("ratedUserId not in", values, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridBetween(Integer value1, Integer value2) {
            addCriterion("ratedUserId between", value1, value2, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateduseridNotBetween(Integer value1, Integer value2) {
            addCriterion("ratedUserId not between", value1, value2, "rateduserid");
            return (Criteria) this;
        }

        public Criteria andRateIsNull() {
            addCriterion("rate is null");
            return (Criteria) this;
        }

        public Criteria andRateIsNotNull() {
            addCriterion("rate is not null");
            return (Criteria) this;
        }

        public Criteria andRateEqualTo(Integer value) {
            addCriterion("rate =", value, "rate");
            return (Criteria) this;
        }

        public Criteria andRateNotEqualTo(Integer value) {
            addCriterion("rate <>", value, "rate");
            return (Criteria) this;
        }

        public Criteria andRateGreaterThan(Integer value) {
            addCriterion("rate >", value, "rate");
            return (Criteria) this;
        }

        public Criteria andRateGreaterThanOrEqualTo(Integer value) {
            addCriterion("rate >=", value, "rate");
            return (Criteria) this;
        }

        public Criteria andRateLessThan(Integer value) {
            addCriterion("rate <", value, "rate");
            return (Criteria) this;
        }

        public Criteria andRateLessThanOrEqualTo(Integer value) {
            addCriterion("rate <=", value, "rate");
            return (Criteria) this;
        }

        public Criteria andRateIn(List<Integer> values) {
            addCriterion("rate in", values, "rate");
            return (Criteria) this;
        }

        public Criteria andRateNotIn(List<Integer> values) {
            addCriterion("rate not in", values, "rate");
            return (Criteria) this;
        }

        public Criteria andRateBetween(Integer value1, Integer value2) {
            addCriterion("rate between", value1, value2, "rate");
            return (Criteria) this;
        }

        public Criteria andRateNotBetween(Integer value1, Integer value2) {
            addCriterion("rate not between", value1, value2, "rate");
            return (Criteria) this;
        }

        public Criteria andRatetimeIsNull() {
            addCriterion("rateTime is null");
            return (Criteria) this;
        }

        public Criteria andRatetimeIsNotNull() {
            addCriterion("rateTime is not null");
            return (Criteria) this;
        }

        public Criteria andRatetimeEqualTo(Date value) {
            addCriterion("rateTime =", value, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeNotEqualTo(Date value) {
            addCriterion("rateTime <>", value, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeGreaterThan(Date value) {
            addCriterion("rateTime >", value, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeGreaterThanOrEqualTo(Date value) {
            addCriterion("rateTime >=", value, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeLessThan(Date value) {
            addCriterion("rateTime <", value, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeLessThanOrEqualTo(Date value) {
            addCriterion("rateTime <=", value, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeIn(List<Date> values) {
            addCriterion("rateTime in", values, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeNotIn(List<Date> values) {
            addCriterion("rateTime not in", values, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeBetween(Date value1, Date value2) {
            addCriterion("rateTime between", value1, value2, "ratetime");
            return (Criteria) this;
        }

        public Criteria andRatetimeNotBetween(Date value1, Date value2) {
            addCriterion("rateTime not between", value1, value2, "ratetime");
            return (Criteria) this;
        }
    }

    public static class Criteria extends GeneratedCriteria {

        protected Criteria() {
            super();
        }
    }

    public static class Criterion {
        private String condition;

        private Object value;

        private Object secondValue;

        private boolean noValue;

        private boolean singleValue;

        private boolean betweenValue;

        private boolean listValue;

        private String typeHandler;

        public String getCondition() {
            return condition;
        }

        public Object getValue() {
            return value;
        }

        public Object getSecondValue() {
            return secondValue;
        }

        public boolean isNoValue() {
            return noValue;
        }

        public boolean isSingleValue() {
            return singleValue;
        }

        public boolean isBetweenValue() {
            return betweenValue;
        }

        public boolean isListValue() {
            return listValue;
        }

        public String getTypeHandler() {
            return typeHandler;
        }

        protected Criterion(String condition) {
            super();
            this.condition = condition;
            this.typeHandler = null;
            this.noValue = true;
        }

        protected Criterion(String condition, Object value, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.typeHandler = typeHandler;
            if (value instanceof List<?>) {
                this.listValue = true;
            } else {
                this.singleValue = true;
            }
        }

        protected Criterion(String condition, Object value) {
            this(condition, value, null);
        }

        protected Criterion(String condition, Object value, Object secondValue, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.secondValue = secondValue;
            this.typeHandler = typeHandler;
            this.betweenValue = true;
        }

        protected Criterion(String condition, Object value, Object secondValue) {
            this(condition, value, secondValue, null);
        }
    }
}