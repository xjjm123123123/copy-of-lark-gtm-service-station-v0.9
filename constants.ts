
export const TAXONOMY = {
  INDUSTRIES: [
    {
      label: "大制造",
      children: [
        { label: "汽车产业链", children: ["整车制造", "汽车零部件", "汽车销售与服务", "新能源电池"] },
        { label: "消费电子产业链", children: ["消费电子终端", "电子元器件", "白色家电", "智能家居"] },
        { label: "能源化工", children: ["石油石化", "煤炭", "化工", "新材料"] },
        { label: "钢铁冶金", children: ["普钢", "特钢", "有色金属", "矿产采选"] },
        { label: "其他制造", children: ["工程机械", "电气设备", "仪器仪表", "烟草"] }
      ]
    },
    {
      label: "大消费",
      children: [
        { label: "零售连锁", children: ["商超便利", "餐饮连锁", "专营专卖"] },
        { label: "食品饮料", children: ["乳制品", "酒类", "休闲食品"] },
        { label: "医药医疗", children: ["医药研发", "医疗器械", "医疗服务"] }
      ]
    },
    {
      label: "金融",
      children: [
        { label: "银行业", children: ["国有行", "股份制", "城商行"] },
        { label: "保险业", children: ["寿险", "财险"] },
        { label: "证券基金", children: ["券商", "公募基金", "私募基金"] }
      ]
    },
    {
      label: "其他",
      children: [
        { label: "互联网", children: ["电商", "社交", "游戏", "生活服务"] },
        { label: "高科技", children: ["软件服务", "人工智能", "云计算"] },
        { label: "物流运输", children: ["快递快运", "供应链管理", "航空航运"] },
        { label: "现代服务", children: ["咨询", "法律", "人力资源"] }
      ]
    }
  ],
  SCENARIOS: [
    {
      label: "研发设计",
      children: [
        { label: "需求管理", children: ["需求收集", "需求评审", "需求追踪"] },
        { label: "产品设计", children: ["CAD集成", "BOM管理", "设计协同"] },
        { label: "项目管理", children: ["进度管理", "资源分配", "工时统计"] }
      ]
    },
    {
      label: "生产制造",
      children: [
        { label: "生产计划", children: ["主生产计划", "排程优化", "物料需求计划"] },
        { label: "质量管理", children: ["IQC来料检验", "PQC过程检", "OQC出货检"] },
        { label: "设备管理", children: ["设备台账", "预防性维护", "备件管理"] },
        { label: "安全生产", children: ["安全培训", "安全巡检", "隐患治理", "应急处置"] }
      ]
    },
    {
      label: "供应物流",
      children: [
        { label: "采购管理", children: ["供应商寻源", "采购订单", "供应商绩效"] },
        { label: "仓储物流", children: ["出入库管理", "库存盘点", "运输调度"] }
      ]
    },
    {
      label: "营销服务",
      children: [
        { label: "客户管理", children: ["线索清洗", "商机跟进", "公海池管理"] },
        { label: "售后服务", children: ["工单派发", "现场服务", "备件更换"] },
        { label: "渠道管理", children: ["经销商管理", "订货管理", "返利管理"] },
        { label: "私域运营", children: ["社群管理", "会员运营"] }
      ]
    },
    {
      label: "组织管理",
      children: [
        { label: "协同办公", children: ["会议管理", "文档协作", "日程管理"] },
        { label: "人力资源", children: ["招聘管理", "绩效考核", "培训学习"] },
        { label: "文化建设", children: ["企业内刊", "员工关怀"] }
      ]
    }
  ],
  ROLES: [
    'CIO', 'CTO', '销售总监', '研发总监', '生产总监', '安全总监', 'HRD', 'CEO', '运营总监', '合规总监', '店长', '督导', '渠道经理', 'PMO总监'
  ],
  PRODUCTS: [
    '飞书项目', '多维表格', '飞书文档', '飞书机器人', 'AnyCross', '飞书会议', '飞书IM', '飞书任务', '飞书妙记', '飞书应用引擎', '云文档', 'GitLab集成', '私有化部署'
  ]
};

// New Taxonomy for AI Hub
export const AI_BUSINESS_TAXONOMY = [
  {
    label: "洞察行业",
    children: ["行业概览", "行业资讯", "客群分级", "行业生态", "市场策略"]
  },
  {
    label: "研发方案",
    children: ["CSM案例", "行业方案", "POV方案", "售前故事线"]
  },
  {
    label: "客户分析",
    children: ["一客一档", "财务经营", "数字化", "高层动态", "客户关键人攻略"]
  },
  {
    label: "打单管理",
    children: ["Pitch复盘", "成单预测", "赢丢单复盘", "经营分析"]
  }
];
