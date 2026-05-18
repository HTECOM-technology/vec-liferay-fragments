export default function IconRemoveCircle(props) {
  const {
    fill = '#F33636',
    size = '20',
    ...otherProps
  } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <circle
        cx="10"
        cy="10"
        r="10"
        fill={fill}
        fillOpacity="0.2"
      />

      <path
        d="M6 10H14"
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
