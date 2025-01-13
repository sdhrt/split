import { create } from "zustand";

interface ParticipantState {
  participants: string[];
  addParticipants: (participant: string) => void;
  removeParticipants: (participantIndex: number) => void;
}

const useParticipantStore = create<ParticipantState>()((set) => ({
  participants: ["ram", "sam", "sarita"],
  addParticipants: (participant) =>
    set((state) => ({ participants: [...state.participants, participant] })),
  removeParticipants: (participantIndex) =>
    set((state) => ({
      participants: state.participants.filter(
        (_, index) => index !== participantIndex,
      ),
    })),
}));

export default useParticipantStore;
