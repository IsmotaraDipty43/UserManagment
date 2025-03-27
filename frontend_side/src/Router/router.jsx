import {
  createBrowserRouter,
} from "react-router-dom";
import Login from "../Component/Login";
import Userlist from "../Component/Userlist";







const router = createBrowserRouter([
    {
      path: "/",
      element:<Login></Login>
    },
   {
    path:'/users',
    element:<Userlist></Userlist>
   }
       
  
   
  ]);




export default router;