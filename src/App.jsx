import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import EmailGenerator from "./features/EmailGenerator";
import MeetingNotes from "./features/MeetingNotes";
import TaskPlanner from "./features/TaskPlanner";
import ResearchAssistant from "./features/ResearchAssistant";
import Chatbot from "./features/Chatbot";

import CoverLetter from "./features/CoverLetter";
import LinkedInBio from "./features/LinkedInBio";
import InterviewPrep from "./features/InterviewPrep";
import SalaryEmail from "./features/SalaryEmail";
import CVBullets from "./features/CVBullets";

const FEATURES = {
  email: <EmailGenerator />,
  notes: <MeetingNotes />,
  planner: <TaskPlanner />,
  research: <ResearchAssistant />,
  chat: <Chatbot />,

  cover: <CoverLetter />,
  linkedin: <LinkedInBio />,
  interview: <InterviewPrep />,
  salary: <SalaryEmail />,
  cv: <CVBullets />,
};

export default function App() {
  const [active, setActive] = useState("email");

  return (
    <div className="flex h-screen overflow-hidden bg-dark">

      <Sidebar
        active={active}
        setActive={setActive}
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        <Header
           active={active}
           setActive={setActive}
        />

        <main className="flex-1 overflow-y-auto p-8">
          {FEATURES[active]}
        </main>

      </div>

    </div>
  );
}