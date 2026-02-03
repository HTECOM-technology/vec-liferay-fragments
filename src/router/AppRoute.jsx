import { Route } from "react-router-dom";

const AppRoute = (props) => {
  const { page: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(appProps) => {
        <Component {...appProps} {...rest} />;
      }}
    />
  );
};

export default AppRoute;
