package com.salo.service;

import com.salo.dao.UserTagMapper;
import com.salo.model.UserTag;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class UserTagService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserTagService.class);

    @Resource
    private UserTagMapper userTagDao;

    public void batchInsert(List<UserTag> userTagList) {
        userTagDao.batchInsert(userTagList);
    }
}
