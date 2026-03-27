export default class Timer {
        _elapsedTime;
        _targetTime;
        _isRunning;
        _isPaused;
        playWhenPaused = false;
        finishCallback;

        constructor(targetTime)
        {
            _elapsedTime = TimeSpan.Zero;
            _targetTime = targetTime;
            _isRunning = false;
            _isPaused = false;
        }

        Start()
        {
            _isRunning = true;
            _isPaused = false;
        }

        Stop()
        {
            _isRunning = false;
            _isPaused = false;
        }

        Pause()
        {
            _isPaused = true;
        }

        Resume()
        {
            _isPaused = false;
        }
        Update(gameTime)
        {
            if (_isRunning && !_isPaused)
            {
                _elapsedTime += gameTime.ElapsedGameTime;
                if (finishCallback != null && IsFinished())
                {
                    finishCallback();
                }
            }
        }

        IsFinished()
        {
            return _elapsedTime >= _targetTime;
        }

        SetTargetTime(targetTime)
        {
            _targetTime = targetTime;
        }
        RemoveTime(timeToRemove)
        {
            _elapsedTime -= timeToRemove;
            if (_elapsedTime < TimeSpan.Zero)
            {
                _elapsedTime = TimeSpan.Zero;
            }
        }
        AddTime(timeToAdd)
        {
            _elapsedTime += timeToAdd;
        }

        Reset()
        {
            _elapsedTime = TimeSpan.Zero;
        }
}