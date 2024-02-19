import React, { useState, useEffect } from 'react'
import DrugNames from './DrugNames'

function MedFollowUp() {
    const [medications, setMedications] = useState([])
    const [newMedication, setNewMedication] = useState("")
    const [pillCount, setPillCount] = useState("")
    const [doseInterval, setDoseInterval] = useState("")
    const [nextDoseTime, setNextDoseTime] = useState({})
    const [suggestedDrugNames, setSuggestedDrugNames] = useState([])

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateNextDoseTime()
        }, 1000)

        return () => clearInterval(intervalId)
    }, [nextDoseTime])

    const handleDrugNameSelect = (selectedDrugName) => {
        setNewMedication(selectedDrugName)
        setSuggestedDrugNames([])
    }

    function handleInputChange(event) {
        const { name, value } = event.target
        if (name === "medication") {
            setNewMedication(value)
        } else if (name === "pillCount") {
            setPillCount(value)
        } else if (name === "doseInterval") {
            setDoseInterval(value)
        }
    }

    function addMedication() {
        if (newMedication.trim() !== "" && pillCount !== 0) {
            setMedications(m => [...m, { name: newMedication, count: pillCount, interval: doseInterval }])
            setNewMedication("")
            setPillCount("")
            setDoseInterval("")
            updateNextDoseTime()
        }
    }

    function deleteMedication(index) {
        const updatedMedications = medications.filter((_, i) => i !== index)
        setMedications(updatedMedications)
        updateNextDoseTime()
    }

    function startTimer(index) {
        const currentTime = new Date()
        const doseIntervalInSeconds = medications[index].interval * 60 * 60
        const nextDose = new Date(currentTime.getTime() + doseIntervalInSeconds * 1000)
        const updatedNextDoseTime = { ...nextDoseTime, [index]: nextDose }
        setNextDoseTime(updatedNextDoseTime)
        
        setTimeout(() => {
            const confirmed = window.confirm(`Did you take ${medications[index].name}?`)
            if (confirmed) {
                const updatedPillCount = medications[index].count - 1
                const updatedMedications = [...medications]
                updatedMedications[index] = {...updatedMedications[index], count: updatedPillCount}
                setMedications(updatedMedications)
                
                startTimer(index)
            }
        }, nextDose.getTime() - currentTime.getTime())
    }

    function updateNextDoseTime() {
        const currentTime = new Date()
        const updatedNextDoseTime = {}
        Object.keys(nextDoseTime).forEach(index => {
            if (nextDoseTime[index]) {
                const timeRemaining = nextDoseTime[index].getTime() - currentTime.getTime()
                if (timeRemaining > 0) {
                    updatedNextDoseTime[index] = new Date(currentTime.getTime() + timeRemaining)
                }
            }
        })
        setNextDoseTime(updatedNextDoseTime)
    }

    function getTimeRemaining(endTime) {
        const total = Date.parse(endTime) - Date.now()
        const seconds = Math.floor((total / 1000) % 60)
        const minutes = Math.floor((total / 1000 / 60) % 60)
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
        return {
            total,
            hours,
            minutes,
            seconds
        }
    }

    return (
        <div className="medication-list">
            <h1>Medication List</h1>
            <div>
                <input
                    type="text"
                    name="medication"
                    placeholder="Enter a medication"
                    value={newMedication}
                    onChange={handleInputChange}
                    autoComplete="off"
                    list="drugNames"
                />
                <datalist id="drugNames">
                    {suggestedDrugNames.map((name, index) => (
                        <option key={index} value={name} />
                    ))}
                </datalist>
                <input
                    type="number"
                    name="pillCount"
                    placeholder="Enter pill count"
                    value={pillCount}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="doseInterval"
                    placeholder="Enter dose interval (hours)"
                    value={doseInterval}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={addMedication}>
                    Add
                </button>
            </div>
            <ol>
                {medications.map((medication, index) => (
                    <li key={index}>
                        <span className="text">{medication.name} - Pill Count: {medication.count}</span>
                        <button className="delete-button" onClick={() => deleteMedication(index)}>
                            Delete
                        </button>
                        <button className="reminder-button" onClick={() => startTimer(index)}>
                            Set Reminder
                        </button>
                        <div className="timer">
                            {nextDoseTime[index] && `${getTimeRemaining(nextDoseTime[index]).hours}h ${getTimeRemaining(nextDoseTime[index]).minutes}m ${getTimeRemaining(nextDoseTime[index]).seconds}s`}
                        </div>
                    </li>
                ))}
            </ol>
            <DrugNames onSelectDrug={handleDrugNameSelect} />
        </div>
    )
}

export default MedFollowUp
