function WelcomeScreen({ currentContent, language, setLanguage, handleStart }) {
  return (
    <div>
      <h1>{currentContent.title}</h1>
      <p>{currentContent.subtitle}</p>

      <p>Current language: {language}</p>

      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("es")}>Español</button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleStart}>{currentContent.start}</button>
      </div>
    </div>
  );
}

export default WelcomeScreen;