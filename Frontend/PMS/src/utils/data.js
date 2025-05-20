import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu"

export const SIDE_MENU_DATA = [
    {
        id:"01",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        path:"/dashboard",
    },
    {
        id:"02",
        label:"RegisterCar",
        icon:LuWalletMinimal,
        path:"/registerCar",
    },
    {
        id:"03",
        label:"Bills",
        icon:LuHandCoins,
        path:"/ticket",
    },
    {
        id:"06",
        label:"Logout",
        icon:LuLogOut,
        path:"logout",
    }
]
