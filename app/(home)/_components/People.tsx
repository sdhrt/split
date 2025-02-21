import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IUser } from "@/schema/user";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";

function People({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  selectedPersons,
  setSelectedPersons,
}: {
  searchQuery: string;
  setSearchQuery: (arg0: string) => void;
  searchResults: IUser[];
  setSearchResults: (arg0: IUser[]) => void;
  selectedPersons: Array<{ name: string; percentage: number }>;
  setSelectedPersons: (
    arg0: Array<{ name: string; percentage: number }>,
  ) => void;
}) {
  useEffect(() => {
    (async () => {
      if (searchQuery.length > 0) {
        const res = await fetch("/api/getusers", {
          method: "POST",
          body: JSON.stringify({ username: searchQuery.toLowerCase() }),
        });
        const { users } = await res.json();
        setSearchResults(users);
      } else {
        setSearchResults([]);
      }
    })();
  }, [searchQuery]);

  const handleAddPerson = (name: string) => {
    if (!selectedPersons.some((person) => person.name === name)) {
      setSelectedPersons([...selectedPersons, { name, percentage: 0 }]);
      setSearchQuery("");
    } else {
      toast({
        title: "Already chosen",
        description: "The chosen user has already been added",
      });
      setSearchQuery("");
    }
  };

  const handleRemovePerson = (name: string) => {
    setSelectedPersons(
      selectedPersons.filter((person) => person.name !== name),
    );
  };

  const handlePercentageChange = (name: string, percentage: number) => {
    setSelectedPersons(
      selectedPersons.map((person) =>
        person.name === name ? { ...person, percentage } : person,
      ),
    );
  };

  return (
    <div>
      <div className="relative">
        <Label htmlFor="name-search">Search Names</Label>
        <Input
          id="name-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type a name"
        />
        {searchResults.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto divide-y divide-slate-200 rounded-md">
            {searchResults.map((user: IUser) => (
              <li
                // @ts-ignore
                key={user._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddPerson(user.username)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="my-2">
        <h3 className="font-semibold mb-2">Selected Persons</h3>
        {selectedPersons.map((person) => (
          <div key={person.name} className="flex items-center space-x-2 mb-2">
            <span className="flex-grow">{person.name}</span>
            <Input
              type="number"
              value={person.percentage}
              onChange={(e) =>
                handlePercentageChange(person.name, Number(e.target.value))
              }
              className="w-20"
              min="0"
              max="100"
            />
            <span>%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemovePerson(person.name)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default People;
