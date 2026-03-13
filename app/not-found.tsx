import ZipLookup from "@/components/ZipLookup";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Page not found</h1>
      <p className="text-gray-500 mb-8">
        The page you are looking for does not exist. Try checking your water quality below.
      </p>
      <div className="flex justify-center">
        <ZipLookup />
      </div>
    </div>
  );
}
