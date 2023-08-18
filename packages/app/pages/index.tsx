import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Select Your Role</h1>

        <div className="space-y-4">
          <label className="block">
            <input type="radio" name="role" value="merchant" className="mr-2" />
            MERCHANT
          </label>

          <label className="block">
            <input type="radio" name="role" value="supplier" className="mr-2" />
            SUPPLIER
          </label>

          <label className="block">
            <input type="radio" name="role" value="buyer" className="mr-2" />
            BUYER
          </label>
        </div>

        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Continue
        </button>
      </div>
    </Layout>
  );
}
