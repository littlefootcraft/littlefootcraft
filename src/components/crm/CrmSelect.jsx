import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export const CrmSelect = ({ value, options, onChange, ariaLabel }) => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef(null);

	const selectedOption =
		options.find((option) => option.value === value) ?? options[0];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className="crm-select"
			ref={selectRef}
		>
			<button
				type="button"
				className="crm-select__trigger"
				onClick={() => setIsOpen((current) => !current)}
				aria-expanded={isOpen}
				aria-label={ariaLabel}
			>
				<span>{selectedOption.label}</span>

				<ChevronDown
					size={16}
					className={`crm-select__chevron ${
						isOpen ? "crm-select__chevron--open" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div className="crm-select__menu">
					{options.map((option) => {
						const isSelected = option.value === value;

						return (
							<button
								key={option.value}
								type="button"
								className={`crm-select__option ${
									isSelected ? "crm-select__option--selected" : ""
								}`}
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
							>
								<span>{option.label}</span>

								{isSelected && <Check size={15} />}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
