import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface ScannerProps {
    onScan: (decodedText: string) => void;
}

export function Scanner({ onScan }: ScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Using a timeout to ensure DOM is ready and cleaner mounting
        const timeoutId = setTimeout(() => {
            if (!document.getElementById("reader")) return;

            // Destroy existing instance if any (safety)
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => { });
            }

            const scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 30, // Increased from 10 for faster scanning
                    qrbox: { width: 300, height: 300 }, // Larger scan area
                    aspectRatio: 1.0,
                    showTorchButtonIfSupported: true,
                    // Enable all common barcode formats
                    formatsToSupport: [
                        0,  // QR_CODE
                        1,  // AZTEC
                        2,  // CODABAR
                        3,  // CODE_39
                        4,  // CODE_93
                        5,  // CODE_128
                        6,  // DATA_MATRIX
                        7,  // MAXICODE
                        8,  // ITF
                        9,  // EAN_13
                        10, // EAN_8
                        11, // PDF_417
                        12, // RSS_14
                        13, // RSS_EXPANDED
                        14, // UPC_A
                        15, // UPC_E
                        16, // UPC_EAN_EXTENSION
                    ],
                    // More aggressive scanning
                    disableFlip: false,
                    rememberLastUsedCamera: true,
                },
                false
            );

            scannerRef.current = scanner;

            scanner.render(
                (decodedText) => {
                    onScan(decodedText);
                    // We don't automatically clear here, we let the parent decide to unmount
                },
                (error) => {
                    // Ignore errors for scanning in progress
                    // console.warn(error);
                }
            );
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
        };
    }, [onScan]);

    return (
        <div className="w-full overflow-hidden rounded-lg border-2 border-primary bg-black/5">
            <div id="reader" className="w-full" />
        </div>
    );
}
