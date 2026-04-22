import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scorlled up to given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top coordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className="scroll-to-top">
            {isVisible && (
                <div onClick={scrollToTop} className="scroll-btn">
                    <ArrowUp size={24} />
                </div>
            )}
            <style>{`
                .scroll-to-top {
                    position: fixed;
                    bottom: 40px;
                    right: 40px;
                    z-index: 9999;
                }
                .scroll-btn {
                    background-color: var(--primary);
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(229, 9, 20, 0.5);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .scroll-btn:hover {
                    transform: scale(1.15) translateY(-5px);
                    box-shadow: 0 8px 25px rgba(229, 9, 20, 0.7);
                }
                @media (max-width: 768px) {
                    .scroll-to-top {
                        bottom: 20px;
                        right: 20px;
                    }
                    .scroll-btn {
                        width: 45px;
                        height: 45px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ScrollToTop;
