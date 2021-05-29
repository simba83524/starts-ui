<template>
  <div class="layout-demo-3-vue">
    <Layout :siderFixed="true" :siderCollapsed="siderCollapsed">
      <Sider theme="dark">
        <div class="layout-logo"></div>
        <Menu style="margin-top: 20px;" class="h-menu-dark" :datas="menuDatas" :inlineCollapsed="siderCollapsed"></Menu>
      </Sider>
      <Layout :headerFixed="headerFixed">
        <HHeader theme="white">
          <div style="width:100px;float:left;">
            <Button icon="h-icon-menu" size="l" noBorder style="font-size: 20px"
                    @click="siderCollapsed=!siderCollapsed"></Button>
          </div>
        </HHeader>
        <div style="padding: 0px 30px;">
          <Breadcrumb :datas="datas" style="margin: 16px 0px;"></Breadcrumb>
          <div style="background: rgb(255, 255, 255); padding: 24px; min-height: 280px;">
            <router-view/>
          </div>
          <HFooter class="text-center">Copyright © {{ year }}
            <a href="https://github.com/simba83524" target="_blank">chenjun</a>
          </HFooter>
        </div>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import Token from '@/utils/token'

export default {
  data() {
    return {
      year: (new Date()).getFullYear(),
      headerFixed: false,
      siderFixed: false,
      siderCollapsed: false,
      menuDatas: [
        {title: '首页', key: 'welcome', icon: 'h-icon-home'},
        {title: '查询', key: 'search', icon: 'h-icon-search'},
        {title: '收藏', key: 'favor', icon: 'h-icon-star', count: 100, children: [{title: '收藏-1', key: 'favor2-1'}]},
        {title: '任务', icon: 'h-icon-task', key: 'task'}
      ],
      datas: [
        {icon: 'h-icon-home'},
        {title: 'Component', icon: 'h-icon-complete', route: {name: 'Component'}},
        {title: 'Breadcrumb', icon: 'h-icon-star'}
      ]
    };
  },
  mounted() {
    let token = this.$store.state.token;
    //console.log("从state中获取token：%s", token.access_token);
    if (!token.access_token) {
      let token = Token.getToken();
      //console.log("从sessionStorage中获取token：%s", JSON.stringify(token));
      if (!token) {
        window.location.href = "/login";
      }
    }
  },
  watch: {
    siderFixed() {
      if (!this.siderFixed) {
        this.headerFixed = false;
      }
    }
  }
};
</script>
<style lang="less">
.layout-demo-3-vue {
  .h-layout {
    background: #f0f2f5;
  }

  .layout-logo {
    height: 34px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 24px;
  }

  .h-layout-footer {
    padding: 24px 50px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
}
</style>
