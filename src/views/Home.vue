<template>
  <div class="layout-demo-3-vue">
    <Layout :siderFixed="true" :siderCollapsed="siderCollapsed">
      <Sider theme="dark">
        <div class="layout-logo"></div>
        <Menu style="margin-top: 20px;" :datas="menuDatas" :option="options"
              :inlineCollapsed="siderCollapsed" ref="menu" @select="triggerSelect" @click="triggerClick"></Menu>
      </Sider>
      <Layout :headerFixed="headerFixed">
        <HHeader theme="white">
          <div style="width:50px;float:left;">
            <Button icon="h-icon-menu" size="l" noBorder style="font-size: 16px"
                    @click="siderCollapsed=!siderCollapsed"></Button>
          </div>
          <div class="buttons" style="display: flex;flex-direction: row;align-items: center;">
            <div v-for="application in aplications" :key="application.id">
              <button class="h-btn h-btn-no-border h-btn-text-primary" style="font-size: 16px" @click="select(application)">{{application.name}}</button>
            </div>
          </div>
        </HHeader>
        <div style="padding: 0px 30px;">
          <Breadcrumb :datas="datas" style="margin: 16px 0px;"></Breadcrumb>
          <div style="background: rgb(255, 255, 255); padding: 24px; min-height: 280px;">
            <transition name="fade">
              <router-view/>
            </transition>
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
import router from "@/router";
import store from '@/store';
import {loadmenus} from "@/api/menu";

export default {
  data() {
    return {
      year: (new Date()).getFullYear(),
      headerFixed: false,
      siderFixed: false,
      siderCollapsed: false,
      sysMenus:[],
      devMenus:[],
      menuDatas: [],
      aplications: [],
      options: {
        titleName: 'title',
        keyName: 'key',
        childrenName: 'children'
      },
      datas: [
        {title: '工作台', icon: 'h-icon-home', route: {name: 'Dashboard'}},
        {title: 'Component', icon: 'h-icon-complete', route: {name: 'Component'}},
        {title: 'Breadcrumb', icon: 'h-icon-star'}
      ]
    };
  },
  methods: {
    select(app) {
      if(app.id == 1){
        this.menuDatas = this.sysMenus;
      }else {
        this.menuDatas = this.devMenus;
      }
    },
    triggerClick(data) {
      console.log(data);
    },
    triggerSelect(menu) {
      this.$Message.info(`选中${menu.title}${menu.path}`);
      let str = menu.name;
      let route = {
        path: '/' + menu.path,
        name: str.replace(str[0], str[0].toUpperCase()),
        meta: menu.meta,
        component: (resolve) => require([`../views/${menu.component}`], resolve)
      };
      router.addRoute('Home', route);
      router.push(route);
      //console.log(router.getRoutes());
    }
  },
  mounted() {
    this.$nextTick(function () {
      loadmenus().then(res => {
        if (res.code == 1111) {
          let menus = res.data;
          store.commit('setMenus', res.data);
          this.aplications = menus.applications;
          menus.menus.forEach(menu=>{
            if(menu.appId == 1){
              this.sysMenus.push(menu);
            }else {
              this.devMenus.push(menu);
            }
          })
          this.menuDatas = this.sysMenus;
        } else {
          console.log(`这是一个${res.message}的消息`);
        }
        console.log(res);
      }).catch(error => {
        console.log(error);
        console.log(`这是一个${error.message}的消息`);
      });
    })
    let token = store.state.token;
    //console.log("从state中获取token：%s", token.access_token);
    if (!token.access_token) {
      let token = Token.getToken();
      //console.log("从sessionStorage中获取token：%s", JSON.stringify(token));
      if (!token) {
        router.replace('Login');
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
