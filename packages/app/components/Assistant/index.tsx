import React from "react";
import Layout, { MobileLayout } from "../Layout";
import { ChildBlurModal } from "../Modal";
import { BiCog, BiSend, BiSolidBot } from "react-icons/bi";
import ImageTag from "../Image";
import { IoIosArrowBack } from "react-icons/io";

const chatLanguages = [
  {
    name: "English",
    code: "en",
  },
];

interface AssistantProps {
  closeAssistantModal: () => void;
  openAssistant: () => void;
  isOpen: boolean;
}

function Assistant({
  closeAssistantModal,
  openAssistant,
  isOpen,
}: AssistantProps) {
  const [settingsModal, setSettingsModal] = React.useState(false);
  const [selectedLang, setSelectedLang] = React.useState("");

  return (
    <>
      <button
        className="w-[50px] h-[50px] p-3 flex flex-col items-center justify-center bg-green-600 text-white-100 rounded-[50%] absolute bottom-[7em] right-[2em] shadow-lg scale-[.95] hover:scale-[1] transition-all cursor-pointer z-[100] "
        onClick={openAssistant}
      >
        <BiSolidBot size={20} />
      </button>
      <ChildBlurModal isOpen={isOpen} className="bg-white-105 hideScrollBar">
        <div className="w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full absolute top-0 py-3 flex items-center justify-between px-[1em] backdrop-blur bg-white-100 bg-opacity-75 ">
            <button
              className="w-auto rounded-md text-[12px] bg-none N-B text-dark-100 flex items-center justify-start top-1"
              onClick={closeAssistantModal}
            >
              <IoIosArrowBack size={20} />
              <p className="text-dark-100 text-[14px] ppM flex items-center justify-center gap-2">
                Back
              </p>
            </button>
            <button
              className="w-[40px] h-[40px] bg-white-300 rounded-[50%] ppM flex flex-col text-center items-center justify-center"
              onClick={() => setSettingsModal(true)}
            >
              <BiCog size={20} />
            </button>
          </div>
          {/* <WelcomeScreen /> */}
          {/* Main chat area */}
          <div className="w-full h-[100vh] flex flex-col items-start justify-start overflow-y-auto hideScrollBar px-4 gap-5">
            {/* Gap */}
            <div className="w-full min-h-[60px] "></div>

            {Array(10)
              .fill(0)
              .map((d) => (
                <>
                  <div className="w-full flex flex-col items-end justify-end">
                    <div className="w-full max-w-[300px] h-auto bg-green-600 text-white-100 flex flex-col items-start justify-start px-3 py-3 text-[12px] ppR rounded-md ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Perferendis a delectus ipsa atque sequi, nulla ipsam.
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-start justify-start">
                    <div className="w-full max-w-[300px] h-auto bg-white2-400 text-dark-100 flex flex-col items-start justify-start px-3 py-3 text-[12px] ppR rounded-md ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore magni beatae, fugit nam impedit id excepturi iusto
                      a numquam quae velit odio distinctio quasi, voluptatibus
                      aspernatur sint. Similique, explicabo rem?
                    </div>
                  </div>
                </>
              ))}

            <div className="w-full min-h-[90px] "></div>
          </div>

          {/* Settings */}
          <ChildBlurModal
            isOpen={settingsModal}
            onClose={() => setSettingsModal(false)}
            showCloseIcon
            isBlurBg
            className="bg-dark-500"
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-full max-w-[300px] flex flex-col items-center justify-center bg-white-100 rounded-md ">
                <div className="w-full border-b-solid border-b-[.5px] border-b-white-400 flex items-center justify-center px-3 py-2">
                  <p className="text-dark-100 ppm text-[14px] ">
                    Chat Settings
                  </p>
                </div>
                <br />
                <div className="w-full flex flex-col items-start justify-start px-3 py-2">
                  <p className="text-dark-100 ppm text-[14px] ">Set language</p>
                  <select
                    name="language"
                    id=""
                    className="w-full mt-2 text-[14px] text-dark-400 bg-white2-300 px-3 py-2 rounded-md ppR"
                    //   onChange={handleControlInp}
                  >
                    <option value="">select language</option>
                    {chatLanguages.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <br />
                <div className="w-full flex flex-col items-center justify-center px-3">
                  <button className="w-full bg-green-600 text-white-100 rounded-[30px] ppM text-[14px] flex items-center justify-center text-center px-3 py-3">
                    Save Settings
                  </button>
                </div>
                <br />
              </div>
            </div>
          </ChildBlurModal>

          {/* chat section */}
          <div className="w-full absolute bottom-0 right-0 flex flex-col items-center justify-center backdrop-blur bg-white-500 bg-opacity-75 px-3 py-3">
            <div className="w-full flex items-center justify-center p-1 rounded-md bg-dark-300 ">
              <textarea
                name=""
                rows={2}
                className="w-full max-h-[50px] text-white-200 text-[14px] ppR py-2 resize-none outline-none px-2 border-none bg-transparent text-white"
              ></textarea>
              <button className="w-[60px] h-[50px] bg-green-600 rounded-md  ppM flex flex-col text-center items-center justify-center">
                <BiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </ChildBlurModal>
    </>
  );
}

export default Assistant;

function WelcomeScreen() {
  return (
    <div className="w-full h-full mt-4 py-8 flex flex-col items-center justify-start">
      <div className="w-auto flex items-center justify-center">
        <ImageTag
          src="/assets/img/logo/leaf-logo.svg"
          className="w-[30px] h-[30px] bg-white-100 p-1 scale-[.85] shadow-xl rounded-[50%]  "
          alt="seedz"
        />
      </div>
      <div className="w-full mt-9 flex flex-col items-center justify-center">
        <h1 className="text-3xl N-EB text-dark-400">Welcome to Seedz AI</h1>
        <p className="text-white-400 N-B mt-3">
          An AI Agriculture Assistant for Farmers
        </p>
        <br />
        <p className="text-white-400 N-B mt-3">Few examples to ask</p>
      </div>
      <div className="w-full mt-9 flex flex-wrap items-center justify-center gap-3">
        <button className="w-full max-w-[120px] bg-white-300 rounded-md ppM text-[14px] flex text-center px-3 py-3">
          How to improve soil condition
        </button>
        <button className="w-full max-w-[120px] bg-white-300 rounded-md ppM text-[14px] flex text-center px-3 py-3">
          How to improve soil condition
        </button>
      </div>
    </div>
  );
}
