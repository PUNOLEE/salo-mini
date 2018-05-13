package com.salo.controller;

import com.alibaba.fastjson.JSON;
import com.salo.model.Bo.RestResponseBo;
import com.salo.model.UserTag;
import com.salo.service.UserTagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Controller
public class PersonController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PersonController.class);

    @Resource
    private UserTagService userTagService;

    @PostMapping(value = "/savetags")
    @ResponseBody
    public RestResponseBo savetags(HttpServletRequest request, @RequestParam(value = "tags", defaultValue = "") String tags) {

        List<Integer> tagIdList = JSON.parseArray(tags, Integer.class);
        int userId = getUserId(request);
        userTagService.batchInsert(tagIdList.stream().map(x -> {
            UserTag userTag = new UserTag();
            userTag.setTagid(x);
            userTag.setUserid(userId);
            return userTag;
        }).collect(Collectors.toList()));
        return RestResponseBo.ok();
    }
}
