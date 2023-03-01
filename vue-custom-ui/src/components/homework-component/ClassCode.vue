<template>
  <div class="classcode">
    班级码：{{classcode}}
  </div>
</template>

<script>
import Base from '@/utils/extend.js';
export default {
  name: 'ClassCode',
  extends: Base,
  data() {
    return {
      classcode: '12345678',
    };
  },
  created() {
    // 课堂中菜单新增班级码按钮
    this.header = this.$TCIC.SDK.instance.getComponent('header-component').getVueInstance().$refs.header;
    this.header.addMenu({
      name: 'classcode',
      class: 'zhiqi-classcode-button',
      label: '班级码',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTEwIDE4YTUuOTk0IDUuOTk0IDAgMDAyLjY4MyA1SDFsMi4xODgtMTBoOS40OTVBNS45OTQgNS45OTQgMCAwMDEwIDE4eiIgZmlsbD0iI0ZGRiIvPjxjaXJjbGUgZmlsbD0iI0ZGRiIgY3g9IjEyLjA0IiBjeT0iNi40OTIiIHI9IjQuNDkyIi8+PHBhdGggZD0iTTE4IDEzYTUgNSAwIDExMCAxMCA1IDUgMCAwMTAtMTB6bTEgMmgtMnYyaC0ydjJoMnYyaDJ2LTJoMnYtMmgtMnYtMnoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvZz48L3N2Zz4=',
      enable: true,
      active: false,
      role: {
        teacher: {
          classType: ['interactive', 'live'],
        },
      },
      action: (event) => {
        this.toggleVisible(event);
      },
    }, 0);
  },
  mounted() {
    this.deviceCheckComplete(this.addListenerResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resetClassInfoPosition, true);
  },
  methods: {
    toggleVisible(event) {
      console.log('#####触发班级码按钮####', event);
      if (document.getElementById('classcode-component-default').style.display == 'none') {
        this.handleShow();
      } else {
        this.handleClose();
      }
    },
    // 展示班级码弹框
    handleShow() {
      const top = document.querySelector('.zhiqi-classcode-button').getBoundingClientRect().top;
      const left = document.querySelector('.zhiqi-classcode-button').getBoundingClientRect().left;
      this.$TCIC.SDK.instance.updateComponent('classcode-component', {
        display: 'block',
        left: `${left + 36}px`,
        top: `${top + 48}px`,
        width: 'auto',
        height: 'auto',
        zIndex: '999',
      });
      this.header.menu.find(item => item.name === 'classcode').active = true;
    },
    // 关闭班级码弹框
    handleClose() {
      this.$TCIC.SDK.instance.updateComponent('classcode-component', {
        display: 'none',
      });
      this.header.menu.find(item => item.name === 'classcode').active = false;
    },
    // 屏幕缩放时班级码弹框位置重置
    resetClassInfoPosition() {
      if (!document.querySelector('.zhiqi-classcode-button')) {
        this.handleClose();
      } else if (document.getElementById('classcode-component-default').style.display == 'block' && document.querySelector('.zhiqi-classcode-button')) {
        this.handleShow();
      }
    },
    // 监听屏幕缩放
    addListenerResize() {
      window.addEventListener('resize', this.resetClassInfoPosition, true);
    },
  },
};
</script>
<style>
#classcode-component-default{
  transform: translate(-100%) !important;
}
.classcode {
  width: 200px;
  height: 50px;
  background-color: #1c2131;
  border-radius: 3px;
  line-height: 30px;
  padding: 10px;
  color: #fff;
  font-size: 14px;
}
</style>
