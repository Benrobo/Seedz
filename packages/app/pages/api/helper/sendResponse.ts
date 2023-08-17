import { NextApiResponse } from "next";

class SendResponse {
  private capitalizeWord(word: string) {
    const capWrd = word.split("")[0].toUpperCase() + word.slice(1);
    return capWrd;
  }

  public error(
    res: NextApiResponse,
    code: string,
    message: string,
    statusCode: number,
    data?: object | null
  ) {
    const response = {
      errorStatus: true,
      code: code ?? "--error",
      message: message ?? this.capitalizeWord("error-message"),
      statusCode: statusCode ?? 400,
      data,
    };
    return res.status(statusCode).json(response);
  }

  public success(
    res: NextApiResponse,
    code: string,
    message: string,
    statusCode: number,
    data?: any
  ) {
    const response = {
      errorStatus: false,
      code: code ?? "--success",
      message: message ?? this.capitalizeWord("success-message"),
      statusCode: statusCode ?? 200,
      data: data ?? null,
    };
    return res.status(statusCode).json(response);
  }
}

export default SendResponse;
