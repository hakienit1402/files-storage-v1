import React, { createContext, useState } from 'react';

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
	const [active, setActive] = useState(0);
	return (
		<LayoutContext.Provider value={{ active, setActive }}>
			{children}
		</LayoutContext.Provider>
	);
};
