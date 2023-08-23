import React from "react";
import Layout, { MobileLayout } from "../Layout";
import { ChildBlurModal } from "../Modal";
import { BiCog, BiSend, BiSolidBot } from "react-icons/bi";
import ImageTag from "../Image";
import { IoIosArrowBack } from "react-icons/io";
import { useMutation } from "@apollo/client";
import { SeedzAssistant } from "@/http";
import handleApolloHttpErrors from "@/http/error";
import MarkdownRenderer from "../MarkdownRender";

const chatLanguages = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "Nigerian Pidgin English",
    code: "pcm",
  },
];

interface AssistantProps {
  closeAssistantModal: () => void;
  openAssistant: () => void;
  isOpen: boolean;
}

interface ChatMessage {
  message: string[] | string;
  type: "bot" | "user" | string;
  lang: string;
  isError: boolean;
}

function Assistant({
  closeAssistantModal,
  openAssistant,
  isOpen,
}: AssistantProps) {
  const [settingsModal, setSettingsModal] = React.useState(false);
  const [selectedLang, setSelectedLang] = React.useState("en");
  const [welcomePage, setWelcomePage] = React.useState(false);
  const [messages, setMessages] = React.useState([] as ChatMessage[]);
  const [askSeedzAiMut, { loading, error, reset, data }] = useMutation(
    SeedzAssistant,
    { errorPolicy: "none" }
  );
  const [userMsg, setUserMsg] = React.useState("");
  const [speech, setSpeech] = React.useState("");

  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const welcomePage =
        localStorage.getItem("@ai_welcome_page") === null
          ? null
          : JSON.parse(localStorage.getItem("@ai_welcome_page") as string);

      setWelcomePage(welcomePage ?? true);

      // onMount load ai messages from localStorage
      const messages =
        localStorage.getItem("@seedz_ai_resp") === null
          ? null
          : JSON.parse(localStorage.getItem("@seedz_ai_resp") as string);
      setMessages(messages ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (messages.length > 0) {
      setWelcomePage(false);
      localStorage.setItem("@ai_welcome_page", JSON.stringify(false));
      localStorage.setItem("@seedz_ai_resp", JSON.stringify(messages));
    }
  }, [messages]);

  React.useEffect(() => {
    reset();
    if (error) {
      const networkError = error.networkError as any;
      const errorObj =
        networkError?.result?.errors[0] ?? error.graphQLErrors[0];
      const err = errorObj?.message;
      const combMsg = [
        ...messages,
        {
          isError: false,
          lang: data?.askSeedzAi?.answer?.lang,
          message: err ?? null,
          type: "bot",
        },
      ];
      setMessages(combMsg);
      localStorage.setItem("@seedz_ai_resp", JSON.stringify(combMsg));
      scrollToBottom();
    } else if (typeof data?.askSeedzAi.success !== "undefined") {
      const combMsg = [
        ...messages,
        {
          isError: false,
          lang: data?.askSeedzAi?.answer?.lang,
          message: data?.askSeedzAi?.answer?.join("") ?? null,
          type: "bot",
        },
      ];
      setMessages(combMsg);
      localStorage.setItem("@seedz_ai_resp", JSON.stringify(combMsg));
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  React.useEffect(() => {
    scrollToBottom();
  }, []);

  function sendInitialAiMsg(msg: string) {
    if (msg.length === 0) return;

    const payload = {
      question: msg,
      lang: selectedLang ?? "en",
    };

    askSeedzAiMut({ variables: { AiInput: payload } });
  }

  function sendMessage() {
    if (userMsg.length === 0) return;

    const payload = {
      question: userMsg,
      lang: selectedLang ?? "en",
    };

    const combMsg = [
      ...messages,
      {
        isError: false,
        lang: selectedLang ?? "en",
        message: userMsg,
        type: "user",
      },
    ];

    askSeedzAiMut({ variables: { AiInput: payload } });
    setMessages(combMsg);
    setUserMsg("");
    localStorage.setItem("@seedz_ai_resp", JSON.stringify(combMsg));
    scrollToBottom();
  }

  // scroll to bottom implementation
  const scrollToBottom = () => {
    (messagesEndRef as any).current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <button
        className="w-[50px] h-[50px] flex flex-col items-center justify-center bg-green-600 text-white-100 rounded-[50%] absolute bottom-[7em] right-[2em] shadow-lg transition-all cursor-pointer z-[100] hover:animate-pulse "
        onClick={openAssistant}
      >
        <BiSolidBot size={45} className="p-3" />
      </button>
      <ChildBlurModal
        isOpen={isOpen}
        className="w-full h-[100vh] bg-white-105 overflow-hidden "
      >
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
          {messages?.length > 0 && (
            <div className="w-full fixed top-0 py-3 flex items-center justify-between px-[1em] z-[100] backdrop-blur bg-white-100 bg-opacity-75 ">
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
          )}
          {messages?.length === 0 && (
            <WelcomeScreen
              sendInitialAiMsg={sendInitialAiMsg}
              setMessage={setMessages}
            />
          )}
          {/* Main chat area */}
          {messages?.length > 0 && (
            <div className="w-full h-[100vh] flex flex-col items-start justify-start overflow-y-auto hideScrollBar px-4 gap-5">
              {/* Gap */}
              <div className="w-full min-h-[160px] "></div>

              {messages?.length > 0
                ? messages?.map((m) => (
                    <div
                      key={m?.message?.length * Math.random() * 100}
                      className="w-full flex flex-col items-start justify-start gap-3"
                    >
                      {m.type === "user" && (
                        <div className="w-full flex flex-col items-end justify-end">
                          <div className="w-auto max-w-[300px] h-auto bg-dark-400 text-white-100 flex flex-col items-start justify-start px-3 py-3 text-[12px] ppR rounded-md ">
                            {m.message}
                          </div>
                        </div>
                      )}
                      {m.type === "bot" && (
                        <div
                          key={m?.message?.length * Math.random() * 100}
                          className="w-full flex flex-col items-start justify-start"
                        >
                          <div
                            className={`w-auto bg-white2-300 h-auto ${
                              m.isError
                                ? "border-solid border-[2px] border-red-305 "
                                : ""
                            } text-dark-100 whitespace-pre-wrap flex flex-col items-start justify-start px-3 py-3 text-[12px] ppR rounded-md ChatMsg`}
                          >
                            {
                              <MarkdownRenderer
                                content={
                                  Array.isArray(m.message)
                                    ? m.message.join("")
                                    : m.message
                                }
                              />
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                : null}

              <div ref={messagesEndRef}></div>

              {loading && (
                <div className="w-full flex flex-col items-start justify-start">
                  <div className="w-auto max-w-[100px] h-auto bg-white2-300 text-white-100 flex flex-col items-start justify-start px-3 py-3 text-[12px] ppR rounded-md chatLoading ">
                    <div className="w-full lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full min-h-[120px] "></div>
            </div>
          )}

          {/* Settings */}
          {settingsModal && (
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
                    <p className="text-dark-100 ppm text-[14px] ">
                      Set language
                    </p>
                    <select
                      name="language"
                      id=""
                      className="w-full mt-2 text-[14px] text-dark-400 bg-white2-300 px-3 py-2 rounded-md ppR"
                      onChange={(e) => setSelectedLang(e.target.value)}
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
                    <button
                      className="w-full bg-green-600 text-white-100 rounded-[30px] ppM text-[14px] flex items-center justify-center text-center px-3 py-3"
                      onClick={() => setSettingsModal(false)}
                    >
                      Continue
                    </button>
                  </div>
                  <br />
                </div>
              </div>
            </ChildBlurModal>
          )}

          {/* chat section */}
          <div className="w-full absolute bottom-[-18px] right-0 flex flex-col items-center justify-center backdrop-blur bg-white-500 bg-opacity-75 px-3 py-3">
            <div className="w-full flex items-center justify-center p-1 rounded-md bg-dark-300 ">
              <input
                name=""
                type="text"
                className="w-full max-h-[50px] text-white-200 text-[14px] ppR py-2 resize-none outline-none px-2 border-none bg-transparent text-white"
                placeholder="Message here..."
                // defaultValue={userMsg}
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <button
                className="w-[60px] h-[50px] bg-green-600 text-white-100 rounded-md  ppM flex flex-col text-center items-center justify-center scale-[.85]"
                onClick={sendMessage}
              >
                <BiSend size={20} />
              </button>
            </div>
            <br />
          </div>
        </div>
      </ChildBlurModal>
    </>
  );
}

export default Assistant;

interface WelcomeScreenProps {
  setMessage: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sendInitialAiMsg: (val: string) => void;
}

function WelcomeScreen({ setMessage, sendInitialAiMsg }: WelcomeScreenProps) {
  const exampleMessages = [
    "How to improve soil condition",
    "What are the most effective methods for pest control on cabbage?",
    "What is the best time to plant okra in Nigeria?",
    "When should I plant my cotton for the best prices when it is ready?",
    "How do I improve soil condition using natural methods?",
    "How can I reduce my water usage for my cotton?",
  ];

  return (
    <div className="w-full h-[100vh] mt-4 py-8 flex flex-col items-center justify-start">
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
        {exampleMessages.map((d) => (
          <button
            key={d}
            className="w-full max-w-[140px] bg-white-300 rounded-md ppM text-[12px] flex text-center px-3 py-3"
            onClick={() => {
              setMessage((prev) => [
                ...prev,
                { message: d, lang: "en", type: "user", isError: false },
              ]);
              sendInitialAiMsg(d);
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
