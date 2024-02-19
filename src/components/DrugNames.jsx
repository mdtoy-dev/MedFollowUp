import React, { useState, useEffect } from 'react'
import axios from 'axios'

function DrugNames({ onSelectDrug }) {
    const [drugNames, setDrugNames] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchDrugNames = async () => {
            try {
                const response = await axios.get('https://api.fda.gov/drug/label.json?search=effective_time:[20090601+TO+20240217]&count=openfda.brand_name.exact')
                const drugs = response.data.results.map(result => result.term)
                setDrugNames(drugs)
            } catch (error) {
                console.error('Error fetching drug names:', error)
            }
        }

        fetchDrugNames()
    }, [])

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleDrugSelection = (drugName) => {
        onSelectDrug(drugName)
        setSearchTerm('')
    }

    const filteredDrugNames = drugNames.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <h2>Drug Names</h2>
            <input
                type="text"
                placeholder="Search drug names"
                value={searchTerm}
                onChange={handleInputChange}
            />
            <ul>
                {filteredDrugNames.map((name, index) => (
                    <li key={index} onClick={() => handleDrugSelection(name)}>
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DrugNames
