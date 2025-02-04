import BillSplitter from "./_components/BillSplitter";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import LoginPage from "./_components/LoginPage";

async function Home() {
  return (
    <div>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <SignedIn>
        <BillSplitter />
      </SignedIn>
    </div>
  );
}

export default Home;
