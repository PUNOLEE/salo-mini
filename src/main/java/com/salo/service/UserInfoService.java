package com.salo.service;

import com.salo.dao.UserInfoMapper;
import com.salo.model.UserInfo;
import com.salo.model.UserInfoExample;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;;import java.util.List;

@Service
public class UserInfoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserInfoService.class);

    @Resource
    private UserInfoMapper userInfoDao;

    public Integer insertUser(UserInfo userInfo) {
        Integer userId = null;
        if (StringUtils.isNotBlank(userInfo.getUsername()) && StringUtils.isNotBlank(userInfo.getPhonenum()) && StringUtils.isNotBlank(userInfo.getPwd())) {
            userInfoDao.insertSelective(userInfo);
        }
        return userInfo.getUserid();
    }

    public UserInfo findUserByOpenId(String openId) {
        UserInfoExample example = new UserInfoExample();
        UserInfoExample.Criteria criteria = example.createCriteria();
        criteria.andOpenidEqualTo(openId);
        List<UserInfo> userInfoList = userInfoDao.selectByExample(example);
        if (!userInfoList.isEmpty()) {
            return userInfoList.get(0);
        } else return null;
    }

}
