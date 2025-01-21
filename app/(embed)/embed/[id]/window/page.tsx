import ChatWindow from '@/app/(dashboard)/dashboard/chatbots/[chatbotId]/chat/chatWindow/page';

export interface ChatComponentProps {
  params: { id: string };
  searchParams: URLSearchParams;
}

export default function Chat({ params, searchParams }: ChatComponentProps) {
  /*
    <iframe src="http://localhost:3000/embed/cm3g1y5sr0001ctepual1zhpvx/window"
  style="overflow: hidden; height: 80vh; border: 0 none; width: 480px; bottom: -30px;" allowfullscreen
  allowtransparency></iframe>
   */

  console.log(params, searchParams);

  return <ChatWindow params={{ chatbotId: params.id, withExitX: searchParams.withExitX === 'true' ? true : false, clientSidePrompt: searchParams.clientSidePrompt || "", defaultMessage: searchParams.defaultMessage || "" }} />;
}