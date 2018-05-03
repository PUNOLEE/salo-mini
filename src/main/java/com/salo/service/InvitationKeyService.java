package com.salo.service;

import com.salo.dao.InvitationKeyMapper;
import com.salo.model.InvitationKey;
import com.salo.model.InvitationKeyExample;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class InvitationKeyService {

    private static final Logger LOGGER = LoggerFactory.getLogger(InvitationKeyService.class);

    @Resource
    private InvitationKeyMapper invitationKeyDao;

    public int findKeyId(String idKey) {
        InvitationKeyExample example = new InvitationKeyExample();
        InvitationKeyExample.Criteria criteria = example.createCriteria();
        criteria.andInvitationkeyEqualTo(idKey);
        List<InvitationKey> invitationKeyList = invitationKeyDao.selectByExample(example);
        if (!invitationKeyList.isEmpty()) {
            InvitationKey invitationKey = invitationKeyList.get(0);
            if(invitationKey.getIsused()) return 0; //已使用过返回0
            invitationKey.setIsused(true);
            invitationKeyDao.updateByPrimaryKeySelective(invitationKey);
            return invitationKey.getId();
        } else return 0;
    }
}
