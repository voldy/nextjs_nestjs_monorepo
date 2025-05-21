import styles from './page.module.css';
import { Button } from '../components/ui';

export default function Index() {
  return (
    <>
      <div className={styles.page}>
        <div className="bg-blue-500 text-white p-4 rounded mb-4">
          Tailwind CSS is <span className="font-bold">working!</span>
        </div>
        <Button variant="secondary">Click me</Button>
      </div>
    </>
  );
}
