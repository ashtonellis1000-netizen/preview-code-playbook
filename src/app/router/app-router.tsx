import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Events from "@/pages/Events";
import Clubs from "@/pages/Clubs";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import Shops from "@/pages/Shops";
import ShopDetailPage from "@/pages/ShopDetail";
import Messages from "@/pages/Messages";
import MessageThreadPage from "@/pages/MessageThread";
import BuildDetails from "@/pages/BuildDetails";
import Comments from "@/pages/Comments";
import QuoteRequest from "@/pages/QuoteRequest";
import NotFound from "@/pages/NotFound";
import { AppShell } from "../layouts/app-shell";
import { FeedScreen } from "@/features/feed/routes/feed-screen";
import { SignInScreen } from "@/features/auth/routes/sign-in-screen";
import { SignUpScreen } from "@/features/auth/routes/sign-up-screen";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="auth">
        <Route path="sign-in" element={<SignInScreen />} />
        <Route path="sign-up" element={<SignUpScreen />} />
      </Route>
      <Route element={<AppShell />}>
        <Route index element={<Index />} />
        <Route path="feed" element={<FeedScreen />} />
        <Route path="events" element={<Events />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="profile" element={<Profile />} />
        <Route path="shops" element={<Shops />} />
        <Route path="shops/:id" element={<ShopDetailPage />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:threadId" element={<MessageThreadPage />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="build/:id" element={<BuildDetails />} />
        <Route path="build/:id/comments" element={<Comments />} />
        <Route path="quote/:id" element={<QuoteRequest />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
