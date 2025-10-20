import { hash } from './crypto';
import { GlobalStrings } from '@/model';
import { safeLogout, getSessionId, toast, btoa64, delay } from '@/common';

const baseUrl = "";

const Exception: Record<string, string> = {
  "600": "invalidInput",
  "401": "badRequest",
  "410": "unexpected",
  "411": "maxTries",
  "500": "networkError",
  "601": "duplicateName",
  "602": "duplicateApiKey",
  "603": "expiredToken",
  "605": "standard",
  "606": "reserved",
  "607": "requiredUnfilled",
  "608": "changingStandard",
  "610": "partialSuccess",
  "611": "recipientNotFound",
  "612": "fileSizeExceeded",
  "613": "fileTypeDisallowed",
  "614": "changingLocked",
  "615": "changingName",
  "616": "unauthorized",
  "617": "unknownError"
}

const Get = async (ifid: string, data: any) => {
  const apiKey = getSessionId() ?? "";
  const headers = btoa64(JSON.stringify({
    'IF_ID': hash(ifid),
    'API_KEY': apiKey
  }));

  const body = btoa64(JSON.stringify(data));
  const jwt = headers + '.' + body + '.' + hash(headers + '.' + body);
  const options = {
    method: 'GET',
    headers: {
      'Authorization': jwt,
    }
  }

  const response = await fetch(baseUrl, options);
  if (response.status === 200) {
      const data = await response.json();
      if (!data?.result_cd ||data?.result_msg !== "200") {
        if (data?.result_msg === "603") {
          toast(GlobalStrings.get("error", "abruptLogout"));
          setTimeout(() => safeLogout(), 3000);
          return;
        } else {
          toast(GlobalStrings.get('error', Exception[data?.result_msg] ?? 'other'));
        }
      } else {
        return data;
      }
  } else {
    toast(GlobalStrings.get('error', 'networkError'));
  }

  return null;
}

const Exit = async () => {
  const apiKey = getSessionId() ?? "";
  const headers = btoa64(JSON.stringify({
    'API_KEY': apiKey
  }));

  const body = btoa64(JSON.stringify({}));
  const jwt = headers + '.' + body + '.' + hash(headers + '.' + body);
  const options = {
    method: 'GET',
    headers: {
      'Authorization': jwt,
    }
  }

  const response = await fetch(baseUrl + "/exit", options);
  if (response.status === 200) {
      const data = await response.json();
      if (!data?.result_cd || data?.result_msg != 200) {
        if (data?.result_msg == 603) {
          toast(GlobalStrings.get("error", "abruptLogout"));
          delay(3000);
          safeLogout();
          return;
        } else {
          toast(GlobalStrings.get('error', Exception[data?.result_msg] ?? 'other'));
        }
      } else {
        return data;
      }
  } else {
    toast(GlobalStrings.get('error', 'networkError'));
  }

  return null;
}

const Inbound = async (auth: string, body: string) => {
  const response = await fetch(baseUrl + "/restservice", {
    method: "POST",
    headers: {
      "Authorization": auth
    },
    body: body
  });
  return response;
}

export default { Get, Exit, Inbound }