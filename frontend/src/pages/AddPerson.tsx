import React, { useState } from "react";
import { locations } from "../utils/utils.js";
import Combobox from "@/components/combobox.js";
import { Calendar22 } from "@/components/ui/datepicker.js";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImagePicker from "@/components/ui/ImagePicker.js";
import { Button } from "@/components/ui/button.js";
import Locations from "@/components/Locations.js";

export const AddPerson = () => {
    const [person, setPerson] = useState<Person>({
        firstname: "",
        middlename: "",
        lastname: "",
        governorate: "",
        district: "",
        area: "",
        dob: undefined,
        dod: undefined,
        sex: "Undisclosed",
        status: "Unknown",
        photo: null,
        deathGovernorate: "",
        deathArea: "",
        deathDistrict: ""
    });

    const nameFields = [
        { id: "firstname", label: "First Name *", required: true },
        { id: "middlename", label: "Middle Name" },
        { id: "lastname", label: "Last Name" },
    ];

    const handleSave = () => {
        console.log("Saving person:", person);
        // You could also call a Supabase insert here.
    };

    return (
        <div className="flex w-full min-h-screen justify-center py-10">
            <div className="flex items-center justify-center lg:w-[1000px] flex-col gap-y-10 px-20 ">
                {/* ---------------------------------- PHOTO ------------------------------------------------ */}
                <div className="space-y-5 text-center">
                    <h3 className="font-medium text-lg ">Photo</h3>
                    <ImagePicker
                        setPhoto={(file) => setPerson((p) => ({ ...p, photo: file }))}
                    />
                </div>

                <hr className="border-t -mb-5 border-gray-200 w-full" />

                {/* ---------------------------------- NAMES ------------------------------------------------ */}
                <div className="flex flex-col w-full text-start text-sm">
                    <p className="text-red-600 italic mb-5 ">* required</p>

                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        {nameFields.map((field) => (
                            <div key={field.id} className="flex flex-col w-[260px]">
                                <label
                                    className="text-sm mb-2 px-1"
                                    htmlFor={field.id}
                                >
                                    {field.label}
                                </label>
                                <input
                                    id={field.id}
                                    name={field.id}
                                    type="text"
                                    required={field.required}
                                    className="border border-gray-200 bg-gray-200/10 rounded px-2 py-1"
                                    value={person[field.id as keyof typeof person] as string}
                                    onChange={(e) =>
                                        setPerson((p) => ({
                                            ...p,
                                            [field.id]: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ---------------------------------- SEX & BIRTHDATE ------------------------------------------------ */}
                <div className="flex flex-col lg:flex-row gap-6 w-full justify-between">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm px-1 ">Sex: *</p>
                        <RadioGroup
                            value={person.sex}
                            className="flex flex-row font-normal"
                            onValueChange={(value) => setPerson((p) => ({ ...p, sex: value }))}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Male" id="Male" />
                                <Label htmlFor="Male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Female" id="Female" />
                                <Label htmlFor="Female">Female</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Undisclosed" id="Undisclosed" />
                                <Label htmlFor="Undisclosed">Undisclosed</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <Calendar22
                            setDate={(date) => setPerson((p) => ({ ...p, dob: date }))}
                            label="Approximate Date of Birth"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-sm px-1 ">Status: </p>
                        <RadioGroup
                            value={person.status}
                            className="flex flex-row font-normal"
                            onValueChange={(value) => setPerson((p) => ({ ...p, status: value }))}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Living" id="Living" />
                                <Label htmlFor="Living">Living</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Deceased" id="Deceased" />
                                <Label htmlFor="Deceased">Deceased</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Unknown" id="Unknown" />
                                <Label htmlFor="Unknown">Unknown</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                {/* ---------------------------------- BIRTHPLACE IN LEBANON ----------------------------------  */}
                <div className="flex w-full justify-start">
                    <h3 className="font-medium text-lg -mb-5">
                        Approximate Location of Birth
                    </h3>
                </div>

                <Locations person={person} setPerson={setPerson} prefix="" />

                {/* ---------------------------------- DEATH ----------------------------------  */}
                {person.status === "Deceased" && (
                    <div className="flex flex-col justify-center w-full">
                        <hr className="border-t border-gray-200 " />

                        <div className="flex w-full justify-start">
                            <h3 className="font-medium text-lg py-5">Death Information</h3>
                        </div>

                        <Locations person={person} setPerson={setPerson} prefix="death" />

                        <div className="pt-10">
                            <Calendar22
                                setDate={(date) => setPerson((p) => ({ ...p, dod: date }))}
                                label="Approximate Date of Death"
                            />
                        </div>
                    </div>
                )}

                <hr className="border-t border-gray-200 w-full " />

                {/* ---------------------------------- BUTTONS ----------------------------------  */}
                <div className="flex flex-row items-center justify-between w-full ">
                    <Button className="w-30 cursor-pointer" variant="destructive">
                        Cancel
                    </Button>
                    <Button className="w-30 cursor-pointer" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};
