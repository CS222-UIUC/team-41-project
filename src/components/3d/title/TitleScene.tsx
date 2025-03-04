import Title from "./Title";
import MusicNotes from "./MusicNotes";
import Record from "./Record";

export default function TitleScene() {
  return (
    <>
      <Title />
      <MusicNotes />
      <Record />

      {/* Environment Setup */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
    </>
  );
}
