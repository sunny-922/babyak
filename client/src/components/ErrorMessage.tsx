interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="error-message">
      <span>⚠️ {message}</span>
    </div>
  );
}