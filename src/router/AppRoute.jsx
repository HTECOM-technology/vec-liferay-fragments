import { Route } from "react-router-dom";

// const AppRoute = (props) => {
//   const { page: Component, ...rest } = props;

//   return (
//     <Route
//       {...rest}
//       render={(appProps) => {
//         <Component {...appProps} {...rest} />;
//       }}
//     />
//   );
// };

const AppRoute = ({ page: Component, ...rest }) => {
  return <Route {...rest} element={<Component {...rest} />} />;
};


export default AppRoute;
