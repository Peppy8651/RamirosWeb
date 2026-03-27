export default class Timer {

        constructor(targetTime)
        {
            this._elapsedTime = 0;
            this._targetTime = targetTime;
            this._isRunning = false;
            this._isPaused = false;
            this.playWhenPaused = false;
            this.finishCallback = null;
        }

        Start()
        {
            this._isRunning = true;
            this._isPaused = false;
        }

        Stop()
        {
            this._isRunning = false;
            this._isPaused = false;
        }

        Pause()
        {
            this._isPaused = true;
        }

        Resume()
        {
            this._isPaused = false;
        }
        Update(delta)
        {
            if (this._isRunning && !this._isPaused)
            {
                this._elapsedTime += delta;
                if (this.finishCallback != null && this.IsFinished())
                {
                    this.finishCallback();
                }
            }
        }

        IsFinished()
        {
            return this._elapsedTime >= this._targetTime;
        }

        SetTargetTime(targetTime)
        {
            this._targetTime = targetTime;
        }
        RemoveTime(timeToRemove)
        {
            this._elapsedTime -= timeToRemove;
            if (this._elapsedTime < 0)
            {
                this._elapsedTime = 0;
            }
        }
        AddTime(timeToAdd)
        {
            this._elapsedTime += timeToAdd;
        }

        Reset()
        {
            this._elapsedTime = 0;
        }
}