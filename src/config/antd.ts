import { ThemeConfig } from "antd";

export const coffeeTheme: ThemeConfig = {
    
    token: {
      colorPrimary: "#FA761E",
      colorBgLayout: "#FFEDD6",
      colorError: "#FA003F",
      colorSuccess: "#41CD7D",
    }, 
  
    components: {
      Typography: {
        colorText: "#0D0D02",
        colorTextHeading: "#0D0D02",
      },
      Dropdown: {
        sizePopupArrow: 0,
        colorBgElevated: "#FDFDF2",
      },
      Popover: {
        sizePopupArrow: 0,
        colorBgElevated: "#FDFDF2",
      },
      Modal: {
        colorBgElevated: "#FDFDF2",
      },
      Layout: {
        siderBg: "#000",
      },
      Table: {
        headerBorderRadius: 4,
        headerBg: "#994F00",
        colorTextHeading: "#FDFDFD",
        colorBgContainer: "#FDFDF2",
        colorText: "#0D0D02",
        headerFilterHoverBg: "#FDFDF2",
        colorTextDescription: "#0D0D02",
        rowHoverBg: "#ecdcbe",
      },
      Card: {
        colorBgContainer: "#FED6A9",
      },
      Empty: {
        controlHeightLG: 0,
        fontSize: 21,
      },
      Alert: {
        colorBgElevated: "#0D0D02",
        colorText: "#FDFDF2",
        colorTextHeading: "#FDFDF2",
        colorIcon: "#FDFDF2",
        colorIconHover: "#FA761E",
        colorInfo: "#FED6A9",
      },
      Notification: {
        colorBgElevated: "#0D0D02",
        colorText: "#FDFDF2",
        colorTextHeading: "#FDFDF2",
        colorIcon: "#FDFDF2",
        colorIconHover: "#FA761E",
        colorInfo: "#FED6A9",
      },
    },
    
}