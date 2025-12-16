using Backend.API.EndpointsSettings;
using Backend.DataAccess;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Backend.API.Configuration;

public static class AppExtensions
{
    public static async Task<IApplicationBuilder> Configure(this WebApplication app)
    {
        app.UseSerilogRequestLogging();

        app.UseRouting();

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();

            await db.Database.MigrateAsync();
        }
        
        app.UseCookiePolicy(new CookiePolicyOptions
        {
            MinimumSameSitePolicy = SameSiteMode.Strict,
            HttpOnly = HttpOnlyPolicy.Always,
            Secure = CookieSecurePolicy.Always,
        });

        app.UseCors("AllowFrontend");

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseAntiforgery();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.MapEndpoints();

        return app;
    }
}