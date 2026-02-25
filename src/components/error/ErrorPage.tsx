function ErrorPage() {
  // Parse the query string to get the message parameter
  const params = new URLSearchParams(window.location.search);
  const message = params.get("message") || "Something went wrong during login.";

  return (
    <div style={{ padding: 40 }}>
      <h2>Login Error</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorPage;