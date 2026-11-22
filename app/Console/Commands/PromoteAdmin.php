<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteAdmin extends Command
{
    protected $signature = 'admin:promote {email : Email of the existing user to promote}';

    protected $description = 'Grant admin access (is_admin = true) to an existing user by email';

    public function handle(): int
    {
        $email = (string) $this->argument('email');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email: {$email}");

            return self::FAILURE;
        }

        if ($user->is_admin) {
            $this->info("{$user->name} ({$user->email}) is already an admin.");

            return self::SUCCESS;
        }

        // is_admin is deliberately not mass-assignable, so set it directly.
        $user->is_admin = true;
        $user->save();

        $this->info("Promoted {$user->name} ({$user->email}) to admin.");

        return self::SUCCESS;
    }
}
