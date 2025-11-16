import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { useAuth } from "react-oidc-context";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/datepicker";

const SQS_QUEUE_URL =
  "https://sqs.us-east-2.amazonaws.com/674010401876/TaskPrintingQueue";
const IDENTITY_POOL_ID = "us-east-2:fe9df120-3b59-465f-9643-61f1809f4436";

function Home() {
  const auth = useAuth();

  const client = new SQSClient({
    region: "us-east-2",
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: "us-east-2" },
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        // Map the user's Cognito token to the login key
        "cognito-idp.us-east-2.amazonaws.com/us-east-2_PXQPW6TiY":
          auth.user?.id_token || "",
      },
    }),
  });

  const [taskDescription, setTaskDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);

  const signOutRedirect = async () => {
    // Clear local auth state first
    await auth.removeUser();

    // Then redirect to Cognito logout
    const clientId = "6fbkrdss49n7526s5sbmlvrhle";
    const logoutUri =
      (import.meta.env.DEV && "http://localhost:5173/") ||
      "https://task-management-fe-bucket.s3.us-east-2.amazonaws.com/index.html";
    const cognitoDomain =
      "https://us-east-2pxqpw6tiy.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const sendSqsMessage = async () => {
    const DueDate = taskDueDate
      ? { DataType: "String", StringValue: taskDueDate?.toLocaleDateString() }
      : null;

    const command = new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      DelaySeconds: 0,
      MessageAttributes: {
        Title: {
          DataType: "String",
          StringValue: taskTitle,
        },
        CreatedDate: {
          DataType: "String",
          StringValue: new Date().toLocaleString(),
        },
        DueDate: DueDate!,
      },
      MessageBody: taskDescription || "No description provided",
    });

    const response = await client.send(command);
    return response;
  };

  const addTask = () => {
    sendSqsMessage();
    setTaskDescription("");
    setTaskTitle("");
    setTaskDueDate(undefined);
  };

  return (
    <div className="h-full flex flex-col justify-end p-4 relative">
      <Button
        onClick={() => signOutRedirect()}
        className="absolute top-4 right-4"
      >
        Sign out
      </Button>
      <h1 className="max-w-sm text-2xl font-bold mb-2">Task Management</h1>
      <div className="flex w-full max-w-sm items-center gap-2 mb-2">
        <DatePicker date={taskDueDate} setDate={setTaskDueDate} />
      </div>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          placeholder="Task Title..."
          className="mb-2"
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Textarea
          placeholder="Task Description...."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          onKeyDown={(e: any) => {
            e.target.style.height = "inherit";
            const height = e.target.scrollHeight;
            e.target.style.height = `${height + 10}px`;
          }}
        />
        <Button type="submit" variant="outline" onClick={addTask}>
          Add Task
        </Button>
      </div>
    </div>
  );
}

export default Home;
