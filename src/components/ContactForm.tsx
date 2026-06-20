import { useState } from "react";
import type { FormEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    characterName: "",
    realm: "",
    discordName: "",
    battletag: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      characterName: "",
      realm: "",
      discordName: "",
      battletag: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Character Name</label>
      <input
        type="text"
        id="character-name"
        name="character-name"
        required
        value={formData.characterName}
        onChange={(e) =>
          setFormData({ ...formData, characterName: e.target.value })
        }
      />
      <label>Realm</label>
      <input
        type="text"
        id="realm"
        name="realm"
        required
        value={formData.realm}
        onChange={(e) => setFormData({ ...formData, realm: e.target.value })}
      />
      <label>Discord Username</label>
      <input
        type="text"
        id="discord-name"
        name="discord-name"
        value={formData.discordName}
        onChange={(e) =>
          setFormData({ ...formData, discordName: e.target.value })
        }
      />
      <label>BattleTag</label>
      <input
        type="text"
        id="battletag"
        name="battletag"
        value={formData.battletag}
        onChange={(e) =>
          setFormData({ ...formData, battletag: e.target.value })
        }
      />
      <button type="submit">Submit</button>
      {formData && <div>{JSON.stringify(formData)}</div>}
    </form>
  );
}
